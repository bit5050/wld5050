/** Theatre.js — cinematic keyframe timelines (scroll, DOM, 3D). */
import { getProject, types, onChange, val } from '@theatre/core'

export { getProject, types, onChange, val }
export type { IProject, ISheet, ISheetObject } from '@theatre/core'

/** Create or load a Theatre project. Pass exported JSON `state` in production. */
export function createTheatreProject(name: string, state?: unknown) {
  return getProject(name, { state: state as never })
}
