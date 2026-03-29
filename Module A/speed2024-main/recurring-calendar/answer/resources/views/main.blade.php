<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .calendar-box {
            width: 1200px;
            margin: 0 auto;
        }

        .calendar-month {
            display: flex;
            justify-content: center;
        }

        .calendar-month input {
            width: 4rem;
            margin-right: 1rem;
        }

        .calendar-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin: 1rem 0;
            border: 1px solid #ddd;
        }

        .calendar-item {
            width: calc(100% / 7);
            border: inherit;
            padding: 1rem;
        }

        .calendar-item.otherMonth {
            color: rgba(0, 0, 0, .5);
            background: rgba(0, 0, 0, .1);
        }

        .task-item {
            background: #3b4cff;
            color: #fff;
            padding: .4rem;
            margin-top: .4rem;
        }

        .required::before {
            content: "*";
            color: red;
        }
    </style>
    <script>
        function selectRecurring(){
            const value = document.querySelector("[name='is_recurring']:checked").value;
            const recurringInfo = document.querySelector("#recurring_info");
            if(value === "true") {
                recurringInfo.innerHTML = `
                    <label>
                        <span class="required"></span>Cycle
                        <input type="number" name="cycle" min="1" required value="1">
                    </label>
                    <label>
                        <span class="required"></span>Type
                        <select name="type" required>
                            <option value="D" selected>Day</option>
                            <option value="W">Week</option>
                            <option value="M">Month</option>
                            <option value="Y">Year</option>
                        </select>
                    </label>
                    <label>
                        End date
                        <input type="date" name="end_date">
                    </label>
                `
            } else {
                recurringInfo.innerHTML = "";
            }
        }
    </script>
</head>
<body>
<div class="calendar-box">

    <form class="calendar-month" action="">
        <label>Year:
            <input type="number" value="{{$year}}" name="year" min="1">
        </label>
        <label>
            Month:
            <input type="number" value="{{$month}}" name="month" min="1" max="12">
        </label>
        <button>change</button>
    </form>

    <div class="calendar-wrapper">
        <div class="calendar-item">S</div>
        <div class="calendar-item">M</div>
        <div class="calendar-item">T</div>
        <div class="calendar-item">W</div>
        <div class="calendar-item">T</div>
        <div class="calendar-item">F</div>
        <div class="calendar-item">S</div>

        @for($i = 0; $i <= $diffDays; $i++)
            @php $currentDate = $startDate->clone()->addDays($i) @endphp
            <div class="calendar-item
            @if(+$currentDate->month !== +$month)
            otherMonth
            @endif
            ">
                {{$currentDate->day}}

                <div class="task-wrapper">
                    @foreach($tasks[$i] as $task)
                        <div class="task-item">{{$task->title}}</div>
                    @endforeach
                </div>
            </div>
        @endfor
    </div>

    <form action="{{route("createTask")}}" method="post">
        @csrf

        <label>
            <span class="required"></span>Title
            <input type="text" name="title">
        </label>

        <label>
            <span class="required"></span>Task date
            <input type="date" name="task_date">
        </label>

        <div>
            <label>
                 One day task
                <input type="radio" name="is_recurring" value="false" onchange="selectRecurring()" checked>
            </label>
            <label>
                Recurring task
                <input type="radio" name="is_recurring" value="true" onchange="selectRecurring()">
            </label>
        </div>

        <div id="recurring_info">

        </div>

        <div>
            <button>Create</button>
        </div>

    </form>

</div>
</body>
</html>
