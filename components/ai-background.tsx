interface AIBackgroundProps {
  variant?: "light" | "dark"
}

export default function AIBackground({ variant = "light" }: AIBackgroundProps) {
  const bgColor = variant === "dark" ? "bg-white" : "bg-black"
  const opacity = variant === "dark" ? "opacity-5" : "opacity-10"

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute top-0 left-0 w-full h-full ${opacity}`}>
        {/* Horizontal lines */}
        <div className={`absolute top-[20%] left-[10%] w-[80%] h-[1px] ${bgColor}`}></div>
        <div className={`absolute top-[40%] left-[10%] w-[60%] h-[1px] ${bgColor}`}></div>
        <div className={`absolute top-[60%] left-[30%] w-[40%] h-[1px] ${bgColor}`}></div>
        <div className={`absolute top-[80%] left-[20%] w-[70%] h-[1px] ${bgColor}`}></div>

        {/* Vertical lines */}
        <div className={`absolute top-[20%] left-[10%] w-[1px] h-[20%] ${bgColor}`}></div>
        <div className={`absolute top-[40%] left-[30%] w-[1px] h-[20%] ${bgColor}`}></div>
        <div className={`absolute top-[20%] left-[50%] w-[1px] h-[40%] ${bgColor}`}></div>
        <div className={`absolute top-[60%] left-[70%] w-[1px] h-[20%] ${bgColor}`}></div>

        {/* Data nodes */}
        <div className="absolute top-[20%] left-[10%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
        <div className="absolute top-[40%] left-[30%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
        <div className="absolute top-[60%] left-[70%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
      </div>
    </div>
  )
}

