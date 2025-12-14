import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <main className="flex items-center justify-center py-35">
        <SignIn />
    </main>
}