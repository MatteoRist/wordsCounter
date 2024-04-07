import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Blue Banner */}
      <div className="bg-blue-500 text-white py-4 px-8">
        <h1 className="text-4xl font-bold text-center">Words Counter</h1>
      </div>
      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
