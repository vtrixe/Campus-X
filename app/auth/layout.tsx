import Image from 'next/image';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen">
      <Image
        src="https://cdn.dribbble.com/users/689436/screenshots/10173985/media/3ec0956719e50aa0a1b094dee6cbd23c.jpg?resize=1000x750&vertical=center"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
