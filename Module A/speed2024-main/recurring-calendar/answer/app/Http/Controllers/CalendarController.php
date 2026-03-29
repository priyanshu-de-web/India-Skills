<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', date('Y')); // Default to current year if not provided
        $month = $request->input('month', date('m')); // Default to current month if not provided

        // Get the first day and last day of the specified month
        $firstDayOfMonth = Carbon::createFromDate($year, $month, 1);
        $lastDayOfMonth = $firstDayOfMonth->copy()->endOfMonth();

        // Calculate the start and end dates for fetching tasks
        $startDate = $firstDayOfMonth->copy()->startOfWeek(Carbon::SUNDAY); // Start from the week containing the first day of the month, with Sunday as the start of the week
        $endDate = $lastDayOfMonth->copy()->endOfWeek(Carbon::SATURDAY); // End at the week containing the last day of the month, with Saturday as the end of the week
        $diffDays = $endDate->diffInDays($startDate);

        $tasks = collect();
        for ($i = 0; $i <= $diffDays; $i++) {
            $date = $startDate->copy()->addDays($i)->toDateString();
            $tasks[] = Task::query()
                // 일반일정
                ->where(function (Builder $query) use ($date) {
                    $query
                        ->where('task_date', $date)
                        ->whereNull("recurring_cycle");
                })
                // 반복일정
                ->orWhere(function (Builder $query) use ($date) {
                    $query
                        // 설정일보다 같거나 커야함
                        ->whereDate('task_date', '<=', $date)
                        // 종료일이 없거나 현재날짜가 같거나작아야함
                        ->where(function (Builder $query) use ($date) {
                            $query
                                ->whereNull('recurring_end_date')
                                ->orWhereDate('recurring_end_date', '>=', $date);
                        })
                        // 반복검사
                        ->where(function (Builder $query) use ($date) {
                            $query
                                // Date
                                ->orWhere(function (Builder $query) use ($date) {
                                    $query
                                        ->where('recurring_type', 'D')
                                        ->whereRaw('MOD(TIMESTAMPDIFF(DAY, ?, task_date), recurring_cycle) = 0', [$date]);
                                })
                                // Week
                                ->orWhere(function (Builder $query) use ($date) {
                                    $query
                                        ->where('recurring_type', 'W')
                                        ->whereRaw('MOD(TIMESTAMPDIFF(DAY, ?, task_date), recurring_cycle * 7) = 0', [$date]);
                                })
                                // Month
                                ->orWhere(function (Builder $query) use ($date) {
                                    $query
                                        ->where('recurring_type', 'M')
                                        ->whereRaw('MOD(MONTH(?) - MONTH(task_date), recurring_cycle) = 0', [$date])
                                        ->where(function (Builder $query) use ($date){
                                            $query
                                                ->whereRaw('DAY(task_date) = DAY(?)', [$date])
                                                ->orWhere(function (Builder $query) use ($date) {
                                                    $query
                                                        ->whereRaw('DAY(task_date) > DAY(LAST_DAY(?))', [$date])
                                                        ->whereRaw('LAST_DAY(?) = ?', [$date, $date]);
                                                });
                                        });
                                })
                                // Year
                                ->orWhere(function (Builder $query) use ($date) {
                                    $query
                                        ->where('recurring_type', 'Y')
                                        ->whereRaw('MOD(YEAR(?) - YEAR(task_date), recurring_cycle) = 0', [$date])
                                        ->where(function (Builder $query) use ($date){
                                            $query
                                                ->whereRaw('DAY(task_date) = DAY(?) AND MONTH(task_date) = MONTH(?)', [$date, $date])
                                                ->orWhere(function (Builder $query) use ($date) {
                                                    $query
                                                        ->whereRaw('DAY(task_date) > DAY(LAST_DAY(?)) AND MONTH(task_date) = MONTH(?)', [$date, $date])
                                                        ->whereRaw('LAST_DAY(?) = ?', [$date, $date]);
                                                });
                                        });
                                });
                        });
                })->get();
        }

        return view("main", compact(["tasks", "startDate", "diffDays", "year", "month", "firstDayOfMonth", "lastDayOfMonth"]));
    }

    public function store(Request $request)
    {
        $input = [
            "title" => $request->title,
            "task_date" => $request->task_date,
        ];

        if($request->is_recurring) {
            $input["recurring_cycle"] = $request->cycle;
            $input["recurring_type"] = $request->type;
            $input["recurring_end_date"] = $request->end_date;
        }

        Task::create($input);

        return redirect()->back();
    }
}
