export async function completeDailySignOut(signOutUser, clearLocalAuth) {
  await signOutUser();
  clearLocalAuth();
}
