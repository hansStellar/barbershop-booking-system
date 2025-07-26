import DashboardLayout from "@/components/layouts/dashboard_layout.js"

// Render the dashboard layout
Orders.getLayout = function getLayout(page) {
    return <DashboardLayout>{page}</DashboardLayout>
}

export default function Orders () {
    return (<div>Test</div>)
}