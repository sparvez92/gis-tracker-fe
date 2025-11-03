import Section from '@/components/custom/Section';
import Image from 'next/image';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div
      className="bg-secondary/80 flex min-h-screen items-center justify-center bg-cover bg-no-repeat p-4 font-sans dark:bg-black"
      style={{ backgroundImage: "url('/login_bg.png')" }}
    >
      <Section className="flex w-full max-w-[630px] flex-col items-center justify-center gap-8 rounded-3xl p-6 md:p-12">
        <Image src="/logo.png" alt="logo" width={234} height={84} />

        <div className="text-center">
          <h1 className="text-primary text-[32px] font-bold">Login to Account</h1>

          <p className="text-primary tracking-tighter-[-0.06px] mt-4 text-lg font-semibold">
            Please enter your email and password to continue
          </p>
        </div>

        <LoginForm />
      </Section>
    </div>
  );
}
