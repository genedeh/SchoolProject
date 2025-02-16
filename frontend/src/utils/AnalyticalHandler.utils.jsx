import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, CartesianGrid, AreaChart, Legend } from "recharts";
const COLORS = [
    "#FF5733", // Bright Red-Orange
    "#33FF57", // Bright Green
    "#3357FF", // Bright Blue
    "#FF33A1", // Pink
    "#33FFF6", // Cyan
    "#FFC300", // Yellow-Gold
    "#C70039", // Deep Red
    "#900C3F", // Dark Magenta
    "#581845", // Dark Purple
    "#8E44AD", // Purple
    "#2ECC71", // Emerald Green
    "#3498DB", // Sky Blue
    "#F1C40F", // Sunflower Yellow
    "#E67E22", // Carrot Orange
    "#1ABC9C", // Teal
    "#D35400", // Dark Orange
    "#7D3C98", // Amethyst
    "#16A085", // Greenish-Blue
    "#2980B9", // Strong Blue
    "#27AE60", // Medium Green
];

// Function to determine WAEC-style grades
export const getGrade = (score) => {
    if (score >= 75) return "A1";
    if (score >= 70) return "B2";
    if (score >= 65) return "B3";
    if (score >= 60) return "C4";
    if (score >= 55) return "C5";
    if (score >= 50) return "C6";
    if (score >= 45) return "D7";
    if (score >= 40) return "E8";
    return "F9";
};


export const GradeDistributionComponent = ({ gradeDistribution }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.keys(gradeDistribution).map(grade => ({ grade, count: gradeDistribution[grade] }))}>
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[Math.floor(Math.random() * COLORS.length)]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export const TermPerformance = ({ termAverages }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={termAverages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                {/* Gradient for Fill */}
                <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <XAxis dataKey="term" stroke="#555" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />

                {/* Filled Area Chart with Line */}
                <Area
                    type="monotone"
                    dataKey="avg"
                    stroke="#0088FE"
                    strokeWidth={2}
                    fill="url(#colorFill)"
                    dot={{ r: 5, fill: '#0088FE' }}
                    activeDot={{ r: 8 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export const SubjectScoreDistribution = ({ subjectStats }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                layout="vertical"  // This makes it a horizontal bar chart
                data={subjectStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="subject" type="category" width={100} />
                <Tooltip />
                <Bar
                    dataKey="score"
                    fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
                    barSize={20}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}