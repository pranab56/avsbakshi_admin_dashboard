export default function Performance() {

    const servicesData = [
        { name: "Hair Services", percentage: 42 },
        { name: "Nails", percentage: 24 },
        { name: "Massage", percentage: 18 },
        { name: "Facials", percentage: 16 },
    ];

    return (
        <div>
            <h3 className="text-2xl font-serif italic font-normal text-[#1E1E1E] mb-6">
                Service Performance
            </h3>

            <div className="space-y-6">
                {servicesData.map((service) => (
                    <div key={service.name} className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm font-normal text-[#1E1E1E]">
                            <span>{service.name}</span>
                            <span className="text-[#1E1E1E] font-normal">{service.percentage}%</span>
                        </div>
                        <div className="h-3 w-full bg-[#D8D0C5] rounded-sm overflow-hidden p-[1px]">
                            <div
                                className="h-full bg-[#B07D2B] rounded-xs transition-all duration-500"
                                style={{ width: `${service.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}