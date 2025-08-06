import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

export const NavigationRoutes = ({
  isMobile = false,
}: NavigationRoutesProps) => {
  return (
    <ul
      className={cn(
        "flex items-center gap-6",
        isMobile && "items-start flex-col gap-8"
      )}
    >
      {MainRoutes.map((route) => (
  route.href.startsWith("#") ? (
    <a key={route.href} href={route.href} className="hover:text-primary">
      {route.label}
    </a>
  ) : (
    <Link key={route.href} to={route.href} className="hover:text-primary">
      {route.label}
    </Link>
  )
))}

    </ul>
  );
};
