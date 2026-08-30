export default function Content() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h2>Largest Rectangle in Histogram</h2>
      <p>
        The <strong>Largest Rectangle in Histogram</strong> problem asks us to find the area of the largest rectangle that can be formed within the bounds of a given histogram. A histogram is represented by an array of integers, where each integer denotes the height of a bar. All bars have a width of 1.
      </p>

      <h3>The Brute Force Approach</h3>
      <p>
        A naive solution would involve checking every possible pair of bars and calculating the minimum height between them to find the area. This approach has a time complexity of <code>O(N^2)</code>, which is inefficient for large histograms.
      </p>

      <h3>Optimized Approach: The Monotonic Stack</h3>
      <p>
        We can solve this problem in <strong>O(N) time</strong> using a <strong>Monotonic Increasing Stack</strong>. A monotonic increasing stack is a stack whose elements are always sorted in an increasing order from bottom to top.
      </p>
      <p>
        The key observation is that the maximum area rectangle that includes a specific bar `i` will have a height equal to `histogram[i]`. Its width will extend to the left until it hits a bar shorter than `histogram[i]` and to the right until it hits another bar shorter than `histogram[i]`.
      </p>
      <p>
        The stack helps us efficiently find the <strong>Next Smaller Element (NSE)</strong> and <strong>Previous Smaller Element (PSE)</strong> for every bar.
      </p>

      <h3>How it Works</h3>
      <ol>
        <li>
          Iterate through the histogram from left to right (index `0` to `n`).
        </li>
        <li>
          If the stack is empty, or the current bar&apos;s height is <strong>greater than or equal to</strong> the height of the bar at the top of the stack, we <strong>push the current index</strong> onto the stack. We maintain an increasing order.
        </li>
        <li>
          If the current bar is <strong>shorter</strong> than the bar at the top of the stack, it means the current bar is the <strong>Next Smaller Element (NSE)</strong> for the bar at the stack&apos;s top.
        </li>
        <li>
          We start <strong>popping elements</strong> from the stack. For every popped element (let&apos;s say its index is `poppedIndex`):
          <ul>
            <li>The height of the rectangle is <code>histogram[poppedIndex]</code>.</li>
            <li>The <strong>Next Smaller Element (NSE)</strong> is the current index we are at (let&apos;s call it `i`).</li>
            <li>The <strong>Previous Smaller Element (PSE)</strong> is the new top of the stack after popping. If the stack becomes empty, it means there are no smaller elements to the left, so the left boundary is <code>-1</code>.</li>
            <li>The width of the rectangle is calculated as: <code>width = NSE - PSE - 1</code>.</li>
            <li>The area is <code>height × width</code>. We update our maximum area if this calculated area is larger.</li>
          </ul>
        </li>
        <li>
          We continue popping and calculating area as long as the stack is not empty and the current bar is shorter than the top of the stack. Then, we push the current index.
        </li>
        <li>
          After iterating through all bars, we may still have elements in the stack. We pop them one by one, treating the right boundary as the end of the histogram (index `n`).
        </li>
      </ol>

      <h3>Complexity Analysis</h3>
      <ul>
        <li><strong>Time Complexity: O(N)</strong> - Every element is pushed and popped from the stack exactly once. Therefore, the operations are linear.</li>
        <li><strong>Space Complexity: O(N)</strong> - The stack can hold up to `N` elements in the worst case (e.g., if the histogram is sorted in ascending order).</li>
      </ul>
    </article>
  );
}
