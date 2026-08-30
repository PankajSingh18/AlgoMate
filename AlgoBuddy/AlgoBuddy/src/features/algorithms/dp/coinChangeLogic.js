export function* coinChangeGenerator(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  yield {
    dp: [...dp],
    index: -1,
    description: `Initialize dp array of size ${amount + 1}. dp[0]=0, others=Infinity. dp[i] = min coins to make amount i.`
  };

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        let prev = dp[i];
        let potential = dp[i - coin] !== Infinity ? dp[i - coin] + 1 : Infinity;
        
        let description = `For amount ${i}, trying coin ${coin}. `;
        if (potential < prev) {
          dp[i] = potential;
          description += `Found better way: dp[${i - coin}] + 1 = ${dp[i]}.`;
        } else {
          description += `Current dp[${i}]=${prev === Infinity ? 'Infinity' : prev} is better than or equal to ${potential === Infinity ? 'Infinity' : potential}.`;
        }

        yield {
          dp: [...dp],
          index: i,
          currentCoin: coin,
          description
        };
      } else {
          yield {
            dp: [...dp],
            index: i,
            currentCoin: coin,
            description: `For amount ${i}, coin ${coin} is too large. Skip.`
          }
      }
    }
  }

  yield {
    dp: [...dp],
    index: amount,
    description: dp[amount] === Infinity 
      ? `Cannot make amount ${amount} with given coins.`
      : `Done! Minimum coins needed for ${amount} is ${dp[amount]}.`,
    isComplete: true
  };
}
