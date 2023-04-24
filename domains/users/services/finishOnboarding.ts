export default async function finishOnboarding(user: Express.User): Promise<void> {
    user.onboarded = true;
    await user.save();
}