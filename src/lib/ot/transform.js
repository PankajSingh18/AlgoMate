// lib/ot/transform.js

/**
 * Operational Transform (OT) Engine
 * Implements OT for collaborative text editing
 */

export class OTEngine {
  constructor() {
    this.version = 0;
    this.history = [];
  }

  /**
   * Apply an operation to the document
   */
  apply(op, document) {
    switch (op.type) {
      case 'insert':
        return this.applyInsert(op, document);
      case 'delete':
        return this.applyDelete(op, document);
      case 'retain':
        return this.applyRetain(op, document);
      default:
        return document;
    }
  }

  /**
   * Insert operation
   */
  applyInsert(op, document) {
    const { position, chars } = op;
    return document.slice(0, position) + chars + document.slice(position);
  }

  /**
   * Delete operation
   */
  applyDelete(op, document) {
    const { position, length } = op;
    return document.slice(0, position) + document.slice(position + length);
  }

  /**
   * Retain operation (no change)
   */
  applyRetain(op, document) {
    return document;
  }

  /**
   * Transform two operations against each other
   */
  transform(op1, op2) {
    // If operations are on different positions, keep both
    if (op1.position < op2.position) {
      // op1 is before op2
      return {
        op1: { ...op1 },
        op2: { ...op2, position: op2.position + op1.chars?.length || 0 }
      };
    } else if (op1.position > op2.position) {
      // op2 is before op1
      return {
        op1: { ...op1, position: op1.position + op2.chars?.length || 0 },
        op2: { ...op2 }
      };
    } else {
      // Same position - need to resolve conflict
      return this.transformSamePosition(op1, op2);
    }
  }

  /**
   * Transform operations at same position
   */
  transformSamePosition(op1, op2) {
    if (op1.type === 'insert' && op2.type === 'insert') {
      // Both insert at same position - insert op1 first, then op2
      return {
        op1: { ...op1 },
        op2: { ...op2, position: op2.position + op1.chars.length }
      };
    } else if (op1.type === 'delete' && op2.type === 'delete') {
      // Both delete - delete op1 first
      return {
        op1: { ...op1 },
        op2: { ...op2, position: op2.position - op1.length }
      };
    } else if (op1.type === 'insert' && op2.type === 'delete') {
      // Insert then delete at same position
      return {
        op1: { ...op1 },
        op2: { ...op2, position: op2.position + op1.chars.length }
      };
    } else if (op1.type === 'delete' && op2.type === 'insert') {
      // Delete then insert at same position
      return {
        op1: { ...op1 },
        op2: { ...op2, position: op2.position - op1.length }
      };
    }
    return { op1, op2 };
  }

  /**
   * Compose multiple operations
   */
  compose(ops) {
    let document = '';
    for (const op of ops) {
      document = this.apply(op, document);
    }
    return document;
  }

  /**
   * Generate operation from diff
   */
  generateOperation(oldText, newText) {
    if (oldText === newText) {
      return null;
    }

    // Find common prefix
    let i = 0;
    while (i < oldText.length && i < newText.length && oldText[i] === newText[i]) {
      i++;
    }

    // Find common suffix
    let j = 0;
    while (j < oldText.length - i && j < newText.length - i && 
           oldText[oldText.length - 1 - j] === newText[newText.length - 1 - j]) {
      j++;
    }

    const start = i;
    const end = oldText.length - j;

    if (start === oldText.length && start === newText.length) {
      return null;
    }

    if (start === oldText.length) {
      // Only insertions
      return {
        type: 'insert',
        position: start,
        chars: newText.slice(start, newText.length - j)
      };
    }

    if (start === newText.length) {
      // Only deletions
      return {
        type: 'delete',
        position: start,
        length: oldText.length - start - j
      };
    }

    // Both insertion and deletion
    return {
      type: 'replace',
      position: start,
      deleteLength: oldText.length - start - j,
      insertChars: newText.slice(start, newText.length - j)
    };
  }

  /**
   * Get current version
   */
  getVersion() {
    return this.version;
  }

  /**
   * Increment version
   */
  incrementVersion() {
    this.version++;
    return this.version;
  }
}

export default OTEngine;