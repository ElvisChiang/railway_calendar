import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果您的 GitHub 儲存庫名稱不是 username.github.io，請取消註釋下方行並填入儲存庫名稱
  // basePath: '/your-repo-name',
};

export default nextConfig;
