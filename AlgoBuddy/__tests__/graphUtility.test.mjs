import { describe, expect, test } from "@jest/globals";
import {
  bfsSteps,
  buildAdjacencyList,
  buildAdjacencyMatrix,
  dfsSteps,
  dijkstraSteps,
  hasCycleDirected,
  primSteps,
  topologicalSort,
} from "../src/utils/graph.js";

describe("graph utility functions", () => {
  test("buildAdjacencyList supports directed, undirected, and weighted edges", () => {
    const edges = [
      { from: 0, to: 1, weight: 4 },
      { from: 1, to: 2, weight: 7 },
    ];

    expect(buildAdjacencyList(3, edges, true)).toEqual({
      0: [1],
      1: [2],
      2: [],
    });

    expect(buildAdjacencyList(3, edges, false, true)).toEqual({
      0: [{ to: 1, weight: 4 }],
      1: [
        { to: 0, weight: 4 },
        { to: 2, weight: 7 },
      ],
      2: [{ to: 1, weight: 7 }],
    });
  });

  test("buildAdjacencyMatrix supports directed and undirected graphs", () => {
    const edges = [{ from: 0, to: 2, weight: 5 }];

    expect(buildAdjacencyMatrix(3, edges, true)).toEqual([
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0],
    ]);

    expect(buildAdjacencyMatrix(3, edges, false, true)).toEqual([
      [0, 0, 5],
      [0, 0, 0],
      [5, 0, 0],
    ]);
  });

  test("bfsSteps records visited nodes and queue snapshots", () => {
    const adj = {
      0: [1, 2],
      1: [3],
      2: [],
      3: [],
    };

    const steps = bfsSteps(adj, 0);

    expect(steps.map((step) => step.current)).toEqual([0, 1, 2, 3]);
    expect([...steps.at(-1).visited]).toEqual([0, 1, 2, 3]);
    expect(steps[1].queue).toEqual([2]);
  });

  test("dfsSteps records traversal order and visited nodes", () => {
    const adj = {
      0: [1, 2],
      1: [3],
      2: [],
      3: [],
    };

    const steps = dfsSteps(adj, 0);

    expect(steps.map((step) => step.current)).toEqual([0, 1, 3, 2]);
    expect([...steps.at(-1).visited]).toEqual([0, 1, 3, 2]);
  });

  test("dijkstraSteps converges shortest-path distances", () => {
    const adj = buildAdjacencyList(
      4,
      [
        { from: 0, to: 1, weight: 2 },
        { from: 0, to: 2, weight: 5 },
        { from: 1, to: 2, weight: 1 },
        { from: 2, to: 3, weight: 3 },
      ],
      true,
      true,
    );

    const steps = dijkstraSteps(adj, 0, 4);

    expect(steps.at(-1).distances).toEqual({
      0: 0,
      1: 2,
      2: 3,
      3: 6,
    });
  });

  test("primSteps accumulates minimum spanning tree edges", () => {
    const adj = buildAdjacencyList(
      4,
      [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 4 },
        { from: 1, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 3 },
      ],
      false,
      true,
    );

    const steps = primSteps(adj, 0, 4);

    expect(steps.at(-1).mstEdges).toEqual([
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 3 },
    ]);
  });

  test("hasCycleDirected detects cyclic and acyclic directed graphs", () => {
    const cyclic = {
      0: [1],
      1: [2],
      2: [0],
    };
    const acyclic = {
      0: [1, 2],
      1: [2],
      2: [],
    };

    expect(hasCycleDirected(3, cyclic)).toBe(true);
    expect(hasCycleDirected(3, acyclic)).toBe(false);
  });

  test("topologicalSort returns an order for DAGs and null for cycles", () => {
    const dag = {
      0: [1, 2],
      1: [3],
      2: [3],
      3: [],
    };
    const cyclic = {
      0: [1],
      1: [2],
      2: [0],
    };

    const order = topologicalSort(4, dag);

    expect(order.indexOf(0)).toBeLessThan(order.indexOf(1));
    expect(order.indexOf(0)).toBeLessThan(order.indexOf(2));
    expect(order.indexOf(1)).toBeLessThan(order.indexOf(3));
    expect(order.indexOf(2)).toBeLessThan(order.indexOf(3));
    expect(topologicalSort(3, cyclic)).toBeNull();
  });
});
