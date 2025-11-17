'use client';
import Field from '@/components/custom/Field';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { DASHBOARD_ROUTE } from '@/constants';
import { useLoginMutation } from '@/graphql/mutations/user.generated';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const LoginForm = () => {
  const router = useRouter();
  const { login, token, init } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync } = useLoginMutation();
  console.log({ token });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (token) {
      router.push(DASHBOARD_ROUTE);
    }
  }, [token]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    mutateAsync({
      input: {
        identifier: values.email,
        password: values.password,
        provider: 'local',
      },
    })
      .then((response) => {
        if (response.login.jwt) {
          login(response.login.jwt);
          router.push('/');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        console.error({ error: error?.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  return (
    <div className="w-full max-w-[516px]">
      <Form {...form}>
        <form className="flex flex-col gap-6 md:gap-10" onSubmit={form.handleSubmit(onSubmit)}>
          <Field
            form={form}
            name="email"
            label="Email address"
            type="email"
            placeholder="esteban_schiller@gmail.com"
          />

          <Field
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          <PrimaryButton label="Sign In" type="submit" isLoading={isLoading} />
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
