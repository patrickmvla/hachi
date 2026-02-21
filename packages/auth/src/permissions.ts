import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  adminAc,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access"

const statement = {
  ...defaultStatements,
  canvas: ["create", "read", "update", "delete", "execute"],
  document: ["create", "read", "update", "delete", "upload"],
  credential: ["create", "read", "delete"],
} as const

export const ac = createAccessControl(statement)

export const owner = ac.newRole({
  ...ownerAc.statements,
  canvas: ["create", "read", "update", "delete", "execute"],
  document: ["create", "read", "update", "delete", "upload"],
  credential: ["create", "read", "delete"],
})

export const admin = ac.newRole({
  ...adminAc.statements,
  canvas: ["create", "read", "update", "delete", "execute"],
  document: ["create", "read", "update", "delete", "upload"],
  credential: ["create", "read", "delete"],
})

export const editor = ac.newRole({
  ...memberAc.statements,
  canvas: ["create", "read", "update", "delete", "execute"],
  document: ["create", "read", "update", "delete", "upload"],
  credential: ["read"],
})

export const viewer = ac.newRole({
  canvas: ["read"],
  document: ["read"],
  credential: ["read"],
})
