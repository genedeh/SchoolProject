import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, CartesianGrid, AreaChart, Legend } from "recharts";


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
                <YAxis/>
                <Tooltip />
                <Bar dataKey="count" fill={"var(--color-primary)"} />
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
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={subjectStats} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                {/* Gradient for Fill */}
                <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                    </linearGradient>
                </defs>

                {/* XAxis with Rotated Labels */}
                <XAxis
                    dataKey="subject"
                    stroke="#555"
                    interval={0} // Ensures all labels appear
                    angle={-90}  // Rotates text vertically
                    textAnchor="end" // Aligns the rotated text properly
                    height={80} // Gives space for the rotated text
                />

                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />

                {/* Filled Area Chart with Line */}
                <Area
                    type="monotone"
                    dataKey="score"
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