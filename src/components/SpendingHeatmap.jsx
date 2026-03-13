import React, { useMemo } from 'react';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';
import useExpenseStore from '../store/expenseStore';
import useUserStore from '../store/userStore';
import { formatCurrency } from '../utils/converter';
import { subMonths, format, parseISO } from 'date-fns';
import { CalendarDays } from 'lucide-react';

const MemoizedCell = React.memo(({ rectProps, data, activeCurrencyCode }) => {
  let fill = '#3f3f46';
  if (data.count > 0 && data.count <= 20) fill = '#86efac';
  else if (data.count > 20 && data.count <= 100) fill = '#22c55e';
  else if (data.count > 100) fill = '#14532d';

  if (!data.date) {
    return <rect {...rectProps} fill="transparent" />;
  }

  const displayDate = format(new Date(data.date), 'MMM d, yyyy');

  return (
    <Tooltip 
      key={rectProps.key} 
      placement="top" 
      content={
        <div className="text-xs text-center p-1 font-sans">
          <p className="font-bold text-white mb-1">Date: {displayDate}</p>
          {data.count !== undefined ? (
            <>
              <p className="text-white/80">Total Spending: <span className="text-emerald-400 font-semibold">{formatCurrency(data.count, activeCurrencyCode)}</span></p>
              <p className="text-white/80">Transactions: <span className="text-indigo-400 font-semibold">{data.transactions}</span></p>
            </>
          ) : (
            <p className="text-white/50">No transactions</p>
          )}
        </div>
      }
    >
      <rect {...rectProps} fill={data.count !== undefined ? fill : '#3f3f46'} rx={2} ry={2} className="hover:stroke-white hover:stroke-[1px] transition-all cursor-pointer" />
    </Tooltip>
  );
});

export const SpendingHeatmap = () => {
  const { expenses, currentViewCurrency, getConversionRate } = useExpenseStore();
  const { campusCurrency, homeCurrency } = useUserStore();
  const activeCurrencyCode = currentViewCurrency === 'campus' ? campusCurrency : homeCurrency;

  const getDisplayAmount = (amount) => {
    if (currentViewCurrency === 'campus') return amount;
    return amount * getConversionRate();
  };

  const { heatMapData, startDate, endDate } = useMemo(() => {
    const today = new Date();
    const end = today;
    const start = subMonths(today, 6);
    
    const dayMap = {};
    expenses.forEach(exp => {
      const dateStr = format(parseISO(exp.date), 'yyyy/MM/dd');
      const amount = getDisplayAmount(exp.amount);
      if (!dayMap[dateStr]) {
        dayMap[dateStr] = { count: 0, transactions: 0 };
      }
      dayMap[dateStr].count += amount;
      dayMap[dateStr].transactions += 1;
    });

    const data = Object.keys(dayMap).map(date => ({
      date: date,
      count: dayMap[date].count,
      transactions: dayMap[date].transactions
    }));

    return { heatMapData: data, startDate: start, endDate: end };
  }, [expenses, getConversionRate, currentViewCurrency]);

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 mt-8 custom-shadow w-full overflow-hidden">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CalendarDays size={20} className="text-emerald-400" />
        Spending Activity
      </h2>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="min-w-[750px]">
          <HeatMap
            value={heatMapData}
            width="100%"
            style={{ color: '#adbac7', '--theme-heatmap-color': 'transparent' }}
            startDate={startDate}
            endDate={endDate}
            legendCellSize={0}
            rectRender={(props, data) => (
              <MemoizedCell key={props.key} rectProps={props} data={data} activeCurrencyCode={activeCurrencyCode} />
            )}
          />
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs font-medium text-white/50">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-[#3f3f46]" />
        <div className="w-3 h-3 rounded-sm bg-[#86efac]" />
        <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
        <div className="w-3 h-3 rounded-sm bg-[#14532d]" />
        <span>More</span>
      </div>
    </div>
  );
};
