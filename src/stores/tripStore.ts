import { defineStore } from 'pinia'

export interface Trip {
  id: string
  distance: number
  cost: number
  date: string
  category: 'personal' | 'work' | 'other'
  destination: string
}

export const useTripStore = defineStore('trip', {
  state: () => ({
    trips: [] as Trip[],
  }),

  getters: {
    totalTrips: (state) => state.trips.length,
    totalDistance: (state) =>
      state.trips.reduce((sum, t) => sum + t.distance, 0),
    totalCost: (state) =>
      state.trips.reduce((sum, t) => sum + t.cost, 0),
    averageCostPerKm(): number {
      return this.totalDistance > 0 ? this.totalCost / this.totalDistance : 0
    },
    chartData(state) {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
      }).reverse()

      return last7Days.map(date => ({
        date,
        count: state.trips.filter(t => t.date.startsWith(date)).length,
        distance: state.trips.filter(t => t.date.startsWith(date)).reduce((sum, t) => sum + t.distance, 0)
      }))
    }
  },

  actions: {
    addTrip(trip: Omit<Trip, 'id'>) {
      this.trips.push({
        ...trip,
        id: crypto.randomUUID(),
      })
    },

    removeTrip(id: string) {
      this.trips = this.trips.filter(t => t.id !== id)
    },
  },

  persist: true,
})