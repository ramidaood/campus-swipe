// DOM patch to handle Google Maps DOM mutations safely
// This prevents React crashes from external DOM manipulations

const originalRemoveChild = Node.prototype.removeChild;
const originalInsertBefore = Node.prototype.insertBefore;

// Patch removeChild to handle NotFoundError
Node.prototype.removeChild = function<T extends Node>(child: T): T {
  try {
    // Check if the child is actually a child of this node
    if (this.contains(child)) {
      return originalRemoveChild.call(this, child);
    } else {
      console.warn('⚠️ DOM Patch: Attempted to removeChild that is not a child of this node');
      return child; // Return the child to prevent errors
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      console.warn('⚠️ DOM Patch: Caught NotFoundError in removeChild, safely ignoring');
      return child;
    }
    throw error;
  }
};

// Patch insertBefore to handle DOM errors
Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
  try {
    return originalInsertBefore.call(this, newNode, referenceNode);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      console.warn('⚠️ DOM Patch: Caught NotFoundError in insertBefore, safely ignoring');
      return newNode;
    }
    throw error;
  }
};

// Export for potential cleanup
export const domPatch = {
  originalRemoveChild,
  originalInsertBefore,
  
  // Restore original methods if needed
  restore() {
    Node.prototype.removeChild = originalRemoveChild;
    Node.prototype.insertBefore = originalInsertBefore;
  }
};

console.log('🔧 DOM Patch: Applied safe DOM mutation handlers'); 