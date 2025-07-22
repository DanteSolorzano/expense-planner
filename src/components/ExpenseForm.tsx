import { useEffect, useState,  } from "react";
import { type ChangeEvent } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css'
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";




export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if(state.editingId){
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId )[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId, state.expenses])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense ({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() 

        //validate
        if(Object.values(expense).includes('')){
            setError('All fields are required')
            return
        } 

        //validate dont exceed the limit
        if((expense.amount - previousAmount) > remainingBudget){
            setError('You’ve exceeded your budget limit.')
            return
        } 

        //add or update an expense
        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload: { expense }})
        }

        //reload the state
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmount(0)

    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
           {state.editingId ? 'Edit Expense' : 'Add New Expense'}
        </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

           <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">Expense Name:</label>
                <input type="text" id="expenseName" placeholder="Add the expense name" className="bg-slate-100 p-2" name="expenseName" value={expense.expenseName} onChange={handleChange}/>

           </div>

           <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Expense Amount:</label>
                <input type="number" id="amount" placeholder="Add the amount spent" className="bg-slate-100 p-2" name="amount" value={expense.amount} onChange={handleChange}/>

           </div>

           <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">Category:</label>
                <select id="category" className="bg-slate-100 p-2" name="category" value={expense.category} onChange={handleChange}>

                    <option value="">-- Select a category --</option>
                    {categories.map(category => (
                        <option value={category.id} key={category.id}>
                            {category.name}
                        </option>
                    ))}

                </select>
           </div>

           <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">Expense Date:</label>
                <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
                />
           </div>

           <input type="submit"
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" 
            value={state.editingId ? 'Save Changes' : 'Add Expense'}
           />
      
    </form>
  )
}
