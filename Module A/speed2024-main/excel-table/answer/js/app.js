const app = Vue.createApp({
    // language=HTML
    template: `
        <div class="box" :style="boxStyle" ref="$scrollBox">
            <div class="wrapper" :style="wrapperStyle">
                <table>
                    <thead>
                    <tr>
                        <td></td>
                        <cell-item v-for="column in displayColumnNumber"
                                   :isTitle="true" :columnNumber="column + startColumn" :row="0"></cell-item>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="row in displayRowNumber">
                        <cell-item :isTitle="true" :columnNumber="0" :row="row + startRow"></cell-item>

                        <cell-item
                                v-for="column in displayColumnNumber"
                                :isTitle="false" :columnNumber="column + startColumn" :row="row + startRow" >
                        </cell-item>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            maxColumnNumber: 16_384 + 1,
            maxRowNumber: 1_048_576 + 1,

            displayColumnNumber: 20,
            displayRowNumber: 30,

            startColumn: 0,
            startRow: 0,

            cellWidth: 70,
            cellHeight: 30,

            scrollBarSize: 0,

            cellData: {}
        }
    },
    methods: {
        scrollTable() {
            const scrollLeft = this.$refs.$scrollBox.scrollLeft;
            this.startColumn = Math.floor(scrollLeft / this.cellWidth);

            const scrollTop = this.$refs.$scrollBox.scrollTop;
            this.startRow = Math.floor(scrollTop / this.cellHeight);
        }
    },
    computed: {
        boxStyle() {
            return {
                width: (this.displayColumnNumber + 1) * this.cellWidth + this.scrollBarSize + "px",
                height: (this.displayRowNumber + 1) * this.cellHeight + this.scrollBarSize + "px",
            }
        },
        wrapperStyle() {
            return {
                width: this.maxColumnNumber * this.cellWidth + "px",
                height: this.maxRowNumber * this.cellHeight + "px",
            }
        },
    },
    mounted() {
        this.scrollBarSize = this.$refs.$scrollBox.offsetWidth - this.$refs.$scrollBox.clientWidth
        this.$refs.$scrollBox.addEventListener("scroll", this.scrollTable);
    },
    unmount() {
        this.$refs.$scrollBox.removeEventListener("scroll", this.scrollTable);
    }
})