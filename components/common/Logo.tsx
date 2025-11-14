"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";

export default function Logo() {
  const router = useRouter();

  const handleClick = () => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjNUw5OL83OLGuRJ5NTl43lODzRR6uarTz0MXwCsuH-0cKVPFtEz4_o7oc6gnfHEWK84sS4xKeQnYq364x3hzif_uc4h6LbunOLd6mdyE_lnvFKw_ZVO1JEoPIy_KCY-97sQeAxLWWe9MtBCEACixqZKCyqtQKlpt9SNCE7npCqcQbpNthu3o1KxVd1K1KtyJvEHlU2OsKs9hLBPoC-mNeWtOsFrH3wr8x4QeI-uR5cOyR1_VOjM_rn0WMC6iNbX6-z2mx_kK1NP2N")`
        }}
        role="img"
        aria-label="Rixly company logo"
      />
      <div className="flex flex-col">
        <h1 className="text-neutral-950 dark:text-white text-base font-bold leading-normal">
          Rixly
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal">
          AI Lead Discovery
        </p>
      </div>
    </div>
  );
}
