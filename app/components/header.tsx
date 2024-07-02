import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full bg-white border-b border-gray-300 mb-3 backdrop-blur-lg z-50 sticky top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex-shrink-0">
            <a href="https://portal.wcf.go.tz/" className="flex items-center gap-2">
              <Image
                src="/wcf.png"
                alt="WCF Logo"
                width={80}
                height={80}
                priority
              />
            </a>
          </div>

          <div className="flex justify-center text-center items-center">
            <div className="truncate font-bold text-sm bg-gray-200 hover:bg-gray-100 py-2 px-2 rounded-lg">
              <Link href="https://wa.me/+225688067709">
                Request Feature ?
              </Link>
            </div>
            <div className="flex p-3">
              <button className="text-sm font-medium py-2 px-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700">
                <Link href="https://portal.wcf.go.tz/">
                  Login
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
