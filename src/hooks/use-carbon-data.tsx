import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { toast } from "sonner";
// Removed Supabase import

import { OnboardingAnswers, calculateBudget } from "@/lib/carbon-utils";

export type { OnboardingAnswers };

export type CarbonProfile = {
  monthlyBudgetKg: number;
  usedKg: number;
  remainingKg: number;
  name: string;
  city: string;
  joined: string;
  answers?: OnboardingAnswers;
};

export type CategoryData = {
  key: string;
  label: string;
  usedKg: number;
  budgetKg: number;
  impact: "High" | "Medium" | "Low";
  color: string;
};

export type Goal = {
  id?: string;
  title: string;
  progress: number;
  reward: string;
  completed?: boolean;
};

export type Activity = {
  id: string | number;
  label: string;
  category: string;
  kg: number;
  when: string;
};

export type TrendPoint = {
  month: string;
  kg: number;
};

type CarbonDataContextProps = {
  user: User | null;
  loading: boolean;
  profile: { name: string; email: string; city: string } | null;
  carbonProfile: CarbonProfile;
  categories: CategoryData[];
  weeklyGoals: Goal[];
  recentActivity: Activity[];
  monthlyTrend: TrendPoint[];
  saveOnboarding: (answers: OnboardingAnswers) => Promise<void>;
  logNewActivity: (label: string, category: string, kg: number) => Promise<void>;
  updateGoalProgress: (title: string, progress: number) => Promise<void>;
  refreshData: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const CarbonDataContext = createContext<CarbonDataContextProps | undefined>(undefined);

const defaultTrend = [
  { month: "Jan", kg: 555 },
  { month: "Feb", kg: 498 },
  { month: "Mar", kg: 412 },
];

export const CarbonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; email: string; city: string } | null>(
    null,
  );

  // Core states
  const [carbonProfileState, setCarbonProfileState] = useState<CarbonProfile>({
    monthlyBudgetKg: 580,
    usedKg: 412,
    remainingKg: 168,
    name: "Alex Rivera",
    city: "Brooklyn, NY",
    joined: "March 2026",
    answers: {
      commute: "car",
      distance: 60,
      diet: "flexitarian",
      household: 2,
      shopping: "monthly",
      wfh: 2,
    },
  });

  const [categoriesState, setCategoriesState] = useState<CategoryData[]>([
    {
      key: "transport",
      label: "Transportation",
      usedKg: 198,
      budgetKg: 240,
      impact: "High",
      color: "var(--chart-1)",
    },
    {
      key: "food",
      label: "Food",
      usedKg: 124,
      budgetKg: 160,
      impact: "Medium",
      color: "var(--chart-2)",
    },
    {
      key: "energy",
      label: "Energy",
      usedKg: 56,
      budgetKg: 110,
      impact: "Low",
      color: "var(--chart-3)",
    },
    {
      key: "shopping",
      label: "Shopping",
      usedKg: 34,
      budgetKg: 70,
      impact: "Low",
      color: "var(--chart-4)",
    },
  ]);

  const [weeklyGoalsState, setWeeklyGoalsState] = useState<Goal[]>([
    { title: "Bike to work 2× this week", progress: 50, reward: "−8 kg CO₂e" },
    { title: "Skip one food delivery", progress: 100, reward: "−3 kg CO₂e" },
    { title: "Plant-based dinners ×4", progress: 75, reward: "−6 kg CO₂e" },
  ]);

  const [recentActivityState, setRecentActivityState] = useState<Activity[]>([
    { id: 1, label: "Subway commute", category: "transport", kg: 1.2, when: "Today, 8:14 AM" },
    { id: 2, label: "Vegetarian lunch", category: "food", kg: 0.9, when: "Today, 12:40 PM" },
    { id: 3, label: "Online order — 2 items", category: "shopping", kg: 4.6, when: "Yesterday" },
    { id: 4, label: "Worked from home", category: "energy", kg: 2.1, when: "Yesterday" },
  ]);

  const [monthlyTrendState, setMonthlyTrendState] = useState<TrendPoint[]>(defaultTrend);

  // Sync state with LocalStorage for offline/guest mode fallback
  useEffect(() => {
    const loadLocalData = () => {
      try {
        const storedProfile = localStorage.getItem("cc_profile");
        const storedCategories = localStorage.getItem("cc_categories");
        const storedGoals = localStorage.getItem("cc_goals");
        const storedActivities = localStorage.getItem("cc_activities");

        if (storedProfile) setCarbonProfileState(JSON.parse(storedProfile));
        if (storedCategories) setCategoriesState(JSON.parse(storedCategories));
        if (storedGoals) setWeeklyGoalsState(JSON.parse(storedGoals));
        if (storedActivities) setRecentActivityState(JSON.parse(storedActivities));
      } catch (e) {
        console.error("Failed to load local carbon coach data", e);
      }
    };

    loadLocalData();
  }, []);

  const loadUserData = useCallback(async (currentUser: User) => {
    try {
      setLoading(true);
      // 1. Load Profile
      const profileSnap = await getDoc(doc(db, "profiles", currentUser.uid));
      const profileData = profileSnap.exists() ? profileSnap.data() : null;

      if (profileData) {
        setProfile({
          name: profileData.name || currentUser.displayName || "Eco User",
          email: profileData.email || currentUser.email || "",
          city: profileData.city || "Brooklyn, NY",
        });
      }

      // 2. Load Carbon Profile
      const carbProfSnap = await getDoc(doc(db, "carbon_profiles", currentUser.uid));
      const carbProf = carbProfSnap.exists() ? carbProfSnap.data() : null;

      // 3. Load Carbon Budget
      const carbBudgetSnap = await getDoc(doc(db, "carbon_budgets", currentUser.uid));
      const carbBudget = carbBudgetSnap.exists() ? carbBudgetSnap.data() : null;

      // 4. Load Activities
      const actQuery = query(collection(db, "activities"), where("user_id", "==", currentUser.uid));
      const actDocs = await getDocs(actQuery);
      const activities = actDocs.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Record<string, unknown>),
      }));
      activities.sort(
        (a, b) =>
          new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime(),
      );

      // 5. Load Goals
      const goalsQuery = query(collection(db, "goals"), where("user_id", "==", currentUser.uid));
      const goalsDocs = await getDocs(goalsQuery);
      const goals = goalsDocs.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Record<string, unknown>),
      }));

      if (carbProf && carbBudget) {
        const answers: OnboardingAnswers = {
          commute: carbProf.commute_mode,
          distance: Number(carbProf.weekly_distance),
          diet: carbProf.diet,
          household: carbProf.household_size,
          shopping: carbProf.shopping_frequency,
          wfh: carbProf.wfh_days,
        };

        const budget = Number(carbBudget.monthly_budget);
        const used = Number(carbBudget.current_usage);

        setCarbonProfileState({
          monthlyBudgetKg: budget,
          usedKg: used,
          remainingKg: Math.max(0, budget - used),
          name: profileData?.name || currentUser.displayName || "Eco User",
          city: profileData?.city || "Brooklyn, NY",
          joined: new Date(profileData?.created_at || Date.now()).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          answers,
        });

        // Set categories based on calculated scores and current activities
        const calcs = calculateBudget(answers);

        // Compute actual category usage from logged activities
        const categoryUsage = { transport: 0, food: 0, energy: 0, shopping: 0 };
        if (activities) {
          activities.forEach((act: { category: string; kg: number | string }) => {
            const cat = act.category as keyof typeof categoryUsage;
            if (cat in categoryUsage) {
              categoryUsage[cat] += Number(act.kg);
            }
          });
        }

        setCategoriesState([
          {
            key: "transport",
            label: "Transportation",
            usedKg: Math.round(categoryUsage.transport),
            budgetKg: calcs.transScore,
            impact: calcs.transScore > 150 ? "High" : calcs.transScore > 80 ? "Medium" : "Low",
            color: "var(--chart-1)",
          },
          {
            key: "food",
            label: "Food",
            usedKg: Math.round(categoryUsage.food),
            budgetKg: calcs.foodScore,
            impact: calcs.foodScore > 150 ? "High" : calcs.foodScore > 80 ? "Medium" : "Low",
            color: "var(--chart-2)",
          },
          {
            key: "energy",
            label: "Energy",
            usedKg: Math.round(categoryUsage.energy),
            budgetKg: calcs.energyScore,
            impact: calcs.energyScore > 100 ? "High" : calcs.energyScore > 50 ? "Medium" : "Low",
            color: "var(--chart-3)",
          },
          {
            key: "shopping",
            label: "Shopping",
            usedKg: Math.round(categoryUsage.shopping),
            budgetKg: calcs.shopScore,
            impact: calcs.shopScore > 80 ? "High" : calcs.shopScore > 40 ? "Medium" : "Low",
            color: "var(--chart-4)",
          },
        ]);
      }

      if (activities && activities.length > 0) {
        setRecentActivityState(
          activities.map(
            (a: {
              id: string;
              label: string;
              category: string;
              kg: number | string;
              created_at: string;
            }) => ({
              id: a.id,
              label: a.label,
              category: a.category,
              kg: Number(a.kg),
              when: new Date(a.created_at).toLocaleDateString("en-US", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }),
          ),
        );
      }

      if (goals && goals.length > 0) {
        setWeeklyGoalsState(
          goals.map(
            (g: {
              id: string;
              title: string;
              progress: number;
              reward: string;
              completed: boolean;
            }) => ({
              id: g.id,
              title: g.title,
              progress: g.progress,
              reward: g.reward,
              completed: g.completed,
            }),
          ),
        );
      }
    } catch (err) {
      console.error("Error loading user data from Supabase", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loadUserData]);

  const saveOnboarding = useCallback(
    async (answers: OnboardingAnswers) => {
      const scores = calculateBudget(answers);
      const updatedProfile: CarbonProfile = {
        monthlyBudgetKg: scores.monthlyBudget,
        usedKg: 0,
        remainingKg: scores.monthlyBudget,
        name: profile?.name || carbonProfileState.name,
        city: profile?.city || carbonProfileState.city,
        joined: carbonProfileState.joined,
        answers,
      };

      const newCategories: CategoryData[] = [
        {
          key: "transport",
          label: "Transportation",
          usedKg: 0,
          budgetKg: scores.transScore,
          impact: scores.transScore > 150 ? "High" : scores.transScore > 80 ? "Medium" : "Low",
          color: "var(--chart-1)",
        },
        {
          key: "food",
          label: "Food",
          usedKg: 0,
          budgetKg: scores.foodScore,
          impact: scores.foodScore > 150 ? "High" : scores.foodScore > 80 ? "Medium" : "Low",
          color: "var(--chart-2)",
        },
        {
          key: "energy",
          label: "Energy",
          usedKg: 0,
          budgetKg: scores.energyScore,
          impact: scores.energyScore > 100 ? "High" : scores.energyScore > 50 ? "Medium" : "Low",
          color: "var(--chart-3)",
        },
        {
          key: "shopping",
          label: "Shopping",
          usedKg: 0,
          budgetKg: scores.shopScore,
          impact: scores.shopScore > 80 ? "High" : scores.shopScore > 40 ? "Medium" : "Low",
          color: "var(--chart-4)",
        },
      ];

      const defaultGoals = [
        {
          title: "Bike to work 2× this week",
          progress: 0,
          reward: `−${Math.round(scores.transScore * 0.15)} kg CO₂e`,
        },
        { title: "Skip one food delivery", progress: 0, reward: "−3 kg CO₂e" },
        { title: "Plant-based dinners ×4", progress: 0, reward: "−6 kg CO₂e" },
      ];

      // Update locally
      setCarbonProfileState(updatedProfile);
      setCategoriesState(newCategories);
      setWeeklyGoalsState(defaultGoals);
      setRecentActivityState([]);

      localStorage.setItem("cc_profile", JSON.stringify(updatedProfile));
      localStorage.setItem("cc_categories", JSON.stringify(newCategories));
      localStorage.setItem("cc_goals", JSON.stringify(defaultGoals));
      localStorage.setItem("cc_activities", JSON.stringify([]));

      // Update in Firebase if logged in
      if (user) {
        try {
          await setDoc(
            doc(db, "carbon_profiles", user.uid),
            {
              commute_mode: answers.commute,
              weekly_distance: answers.distance,
              diet: answers.diet,
              household_size: answers.household,
              shopping_frequency: answers.shopping,
              wfh_days: answers.wfh,
              transportation_score: scores.transScore,
              food_score: scores.foodScore,
              energy_score: scores.energyScore,
              shopping_score: scores.shopScore,
            },
            { merge: true },
          );

          await setDoc(
            doc(db, "carbon_budgets", user.uid),
            {
              monthly_budget: scores.monthlyBudget,
              current_usage: 0,
              remaining_budget: scores.monthlyBudget,
            },
            { merge: true },
          );

          // Clean out existing goals and activities
          const batch = writeBatch(db);
          const goalsQuery = query(collection(db, "goals"), where("user_id", "==", user.uid));
          const goalsSnapshot = await getDocs(goalsQuery);
          goalsSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));

          const activitiesQuery = query(
            collection(db, "activities"),
            where("user_id", "==", user.uid),
          );
          const activitiesSnapshot = await getDocs(activitiesQuery);
          activitiesSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
          await batch.commit();

          const insertBatch = writeBatch(db);
          defaultGoals.forEach((g) => {
            const newGoalRef = doc(collection(db, "goals"));
            insertBatch.set(newGoalRef, {
              user_id: user.uid,
              title: g.title,
              progress: g.progress,
              reward: g.reward,
              completed: false,
            });
          });
          await insertBatch.commit();

          toast.success("Carbon Profile saved and synced with cloud!");
        } catch (err) {
          console.error("Firebase onboarding sync failed", err);
          toast.warning("Profile saved locally (Offline mode)");
        }
      } else {
        toast.success("Carbon Profile saved locally! Sign in to sync to cloud.");
      }
    },
    [profile, carbonProfileState, user],
  );

  const logNewActivity = useCallback(
    async (label: string, category: string, kg: number) => {
      const newActivity: Activity = {
        id: Date.now(),
        label,
        category,
        kg,
        when: "Just now",
      };

      const updatedActivities = [newActivity, ...recentActivityState];
      setRecentActivityState(updatedActivities);
      localStorage.setItem("cc_activities", JSON.stringify(updatedActivities));

      // Update categories usage
      const updatedCategories = categoriesState.map((cat) => {
        if (cat.key === category) {
          const newUsed = Number((cat.usedKg + kg).toFixed(1));
          return { ...cat, usedKg: newUsed };
        }
        return cat;
      });
      setCategoriesState(updatedCategories);
      localStorage.setItem("cc_categories", JSON.stringify(updatedCategories));

      // Update profile budget
      const newUsedKg = Number((carbonProfileState.usedKg + kg).toFixed(1));
      const updatedProfile = {
        ...carbonProfileState,
        usedKg: newUsedKg,
        remainingKg: Math.max(
          0,
          Number((carbonProfileState.monthlyBudgetKg - newUsedKg).toFixed(1)),
        ),
      };
      setCarbonProfileState(updatedProfile);
      localStorage.setItem("cc_profile", JSON.stringify(updatedProfile));

      if (user) {
        try {
          const newActivityRef = doc(collection(db, "activities"));
          await setDoc(newActivityRef, {
            user_id: user.uid,
            label,
            category,
            kg,
            created_at: new Date().toISOString(),
          });

          await setDoc(
            doc(db, "carbon_budgets", user.uid),
            {
              current_usage: newUsedKg,
              remaining_budget: updatedProfile.remainingKg,
            },
            { merge: true },
          );

          toast.success("Activity logged to cloud!");
        } catch (err) {
          console.error("Failed to log activity to Firebase", err);
          toast.warning("Activity saved locally (Offline)");
        }
      } else {
        toast.success("Activity logged locally!");
      }
    },
    [recentActivityState, categoriesState, carbonProfileState, user],
  );

  const updateGoalProgress = useCallback(
    async (title: string, progress: number) => {
      const updatedGoals = weeklyGoalsState.map((g) => {
        if (g.title === title) {
          return { ...g, progress, completed: progress >= 100 };
        }
        return g;
      });

      setWeeklyGoalsState(updatedGoals);
      localStorage.setItem("cc_goals", JSON.stringify(updatedGoals));

      if (user) {
        try {
          const goalQ = query(
            collection(db, "goals"),
            where("user_id", "==", user.uid),
            where("title", "==", title),
          );
          const goalSnap = await getDocs(goalQ);
          if (!goalSnap.empty) {
            await setDoc(
              goalSnap.docs[0].ref,
              { progress, completed: progress >= 100 },
              { merge: true },
            );
          }
        } catch (err) {
          console.error("Failed to sync goal to Firebase", err);
        }
      }
    },
    [weeklyGoalsState, user],
  );

  const refreshData = useCallback(async () => {
    if (user) {
      await loadUserData(user);
    }
  }, [user, loadUserData]);

  const signOutUser = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setProfile(null);
    // Reset to local template values
    setCarbonProfileState({
      monthlyBudgetKg: 580,
      usedKg: 412,
      remainingKg: 168,
      name: "Guest User",
      city: "Offline Mode",
      joined: "Today",
      answers: {},
    });
    localStorage.removeItem("cc_profile");
    localStorage.removeItem("cc_categories");
    localStorage.removeItem("cc_goals");
    localStorage.removeItem("cc_activities");
    toast.success("Logged out successfully");
  }, []);

  const providerValue = useMemo(
    () => ({
      user,
      loading,
      profile,
      carbonProfile: carbonProfileState,
      categories: categoriesState,
      weeklyGoals: weeklyGoalsState,
      recentActivity: recentActivityState,
      monthlyTrend: monthlyTrendState,
      saveOnboarding,
      logNewActivity,
      updateGoalProgress,
      refreshData,
      signOutUser,
    }),
    [
      user,
      loading,
      profile,
      carbonProfileState,
      categoriesState,
      weeklyGoalsState,
      recentActivityState,
      monthlyTrendState,
      saveOnboarding,
      logNewActivity,
      updateGoalProgress,
      refreshData,
      signOutUser,
    ],
  );

  return <CarbonDataContext.Provider value={providerValue}>{children}</CarbonDataContext.Provider>;
};

export const useCarbonData = () => {
  const context = useContext(CarbonDataContext);
  if (!context) {
    throw new Error("useCarbonData must be used within CarbonDataProvider");
  }
  return context;
};
