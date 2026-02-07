import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, ShoppingCart, Building2 } from 'lucide-react'

/**
 * Quick Actions Component
 * Quick access buttons for common actions
 */

const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'New Material',
      icon: Package,
      onClick: () => navigate('/materials?action=new'),
      variant: 'default',
    },
    {
      label: 'New Purchase',
      icon: ShoppingCart,
      onClick: () => navigate('/purchases?action=new'),
      variant: 'default',
    },
    {
      label: 'New Company',
      icon: Building2,
      onClick: () => navigate('/companies?action=new'),
      variant: 'outline',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              onClick={action.onClick}
              className="w-full justify-start"
            >
              <action.icon className="w-5 h-5 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
