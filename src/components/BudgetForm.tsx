import { useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {

    const [budget, setBudget] = useState(0)
    const { dispatch } = useBudget()

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber)
    }

    const isValid = useMemo(() => {
        return isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch({type: 'add-budget', payload: {budget}})

    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-5">
            <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                Set Budget
            </label>
            <input type="number"
                   className="w-full bg-white border border-gray-200 p-2"
                   placeholder="Set your budget"
                   name="budget"
                   value={budget}
                   onChange={handleChange}
                   id="budget"
            />

        </div>

        <input type="submit" 
                value='define budget'
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40 disabled:cursor-default disabled:hover:bg-blue-600"
                disabled={isValid}
        />
      
    </form>
  )
}
