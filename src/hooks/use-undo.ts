import { useState, useCallback } from "react"

export function useUndo<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const [undoStack, setUndoStack] = useState<T[]>([])
  const [redoStack, setRedoStack] = useState<T[]>([])

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const previous = undoStack[undoStack.length - 1]
      setUndoStack(undoStack.slice(0, -1))
      setRedoStack([state, ...redoStack])
      setState(previous)
    }
  }, [state, undoStack, redoStack])

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const next = redoStack[0]
      setRedoStack(redoStack.slice(1))
      setUndoStack([...undoStack, state])
      setState(next)
    }
  }, [state, undoStack, redoStack])

  const setStateWithHistory = useCallback(
    (newState: T) => {
      setUndoStack([...undoStack, state])
      setRedoStack([])
      setState(newState)
    },
    [state, undoStack],
  )

  return {
    state,
    setState: setStateWithHistory,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  }
}

