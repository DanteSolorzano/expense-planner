import { useReducer, useMemo, createContext, type ReactNode } from "react"
import { budgetReducer, initialState, type BudgetActions, type BudgetState } from "../reducers/budget-reducer"

type BudgetContextProps = {
    state: BudgetState
    dispatch: React.ActionDispatch<[action: BudgetActions]>
    totalExpenses: number
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
}

/* eslint-disable react-refresh/only-export-components */
export const BudgetContext = createContext<BudgetContextProps>(null!);
/* eslint-enable react-refresh/only-export-components */

export const BudgetProvider = ({children} : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetReducer, initialState)

    const totalExpenses = useMemo( () => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])
    
    const remainingBudget = state.budget - totalExpenses


    return (
            <BudgetContext.Provider
                value={{
                    state,
                    dispatch,
                    totalExpenses,
                    remainingBudget
                }}
            >
                {children}
            </BudgetContext.Provider>
    )
}