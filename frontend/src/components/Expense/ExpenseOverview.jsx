    import React, {useState, useEffect} from 'react'
    import { LuPlus } from 'react-icons/lu'
    import { prepareExpenseLineChartData } from '../../utils/helper';
    import CustomLineChart from '../Charts/CustomLineChart';
    
    const ExpenseOverview = ({expenses, loading, onAddExpense}) => {
        const [chartData, setChartData] = useState([]);

        useEffect(() => {
          // Process expenses to generate chart data
          const result = prepareExpenseLineChartData(expenses);
          setChartData(result);

          return () => {};
        }, [expenses]);

      return (
        <div className='card'>
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spending habits and manage your finances effectively.
                    </p>
                </div>
                <button className='add-btn' onClick={onAddExpense}>
                    <LuPlus className='text-lg'/> Add Expense
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart
                    data={chartData}
                />
            </div>

        </div>
      )
    }
    
    export default ExpenseOverview