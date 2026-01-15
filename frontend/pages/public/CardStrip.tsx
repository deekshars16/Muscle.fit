import React from 'react'
import IconCard from '../../components/common/IconCard'
import { Home, User, Dumbbell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CardStrip: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="-mt-8 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-0 md:px-2">
        <div className="bg-white dark:bg-black rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 transition-colors duration-300">
          <IconCard
            icon={Home}
            title="Owner"
            subtitle="Manage your gym and trainers"
            onClick={() => navigate('/auth/owner-login')}
          />

          <IconCard
            icon={Dumbbell}
            title="Trainer"
            subtitle="View and manage assigned members"
            onClick={() => navigate('/auth/register?role=trainer')}
          />

          <IconCard
            icon={User}
            title="Member"
            subtitle="See trainer details and membership"
            onClick={() => navigate('/auth/register?role=member')}
          />
        </div>
      </div>
    </section>
  )
}

export default CardStrip
