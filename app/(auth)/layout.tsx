const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col justify-center">
      <main className="">{children}</main>
    </div>
  );
};

export default AuthLayout;
