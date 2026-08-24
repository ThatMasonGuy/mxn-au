const ADMINISTRATOR_PERMISSION = 0x8n
const MANAGE_GUILD_PERMISSION = 0x20n

export function canManageDiscordGuild(guild) {
  if (!guild) return false
  const permissions = BigInt(guild.permissions || 0)
  return (permissions & ADMINISTRATOR_PERMISSION) === ADMINISTRATOR_PERMISSION
    || (permissions & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION
}
