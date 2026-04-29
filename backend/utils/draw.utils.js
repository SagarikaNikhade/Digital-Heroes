// Generate 5 random numbers (1–45)
export const generateNumbers = () => {
  const nums = new Set();

  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(nums);
};

// Match count
export const getMatchCount = (userScores, drawNumbers) => {
  return userScores.filter((n) => drawNumbers.includes(n)).length;
};

// Prize pool calculation
export const calculatePrizePool = (activeUsers) => {
  const subscriptionAmount = 500; // ₹500 monthly
  const contributionPercent = 0.5; // 50%

  return activeUsers * subscriptionAmount * contributionPercent;
};

// Tier split
export const splitTiers = (prizePool) => {
  return {
    match5: prizePool * 0.4,
    match4: prizePool * 0.35,
    match3: prizePool * 0.25,
  };
};