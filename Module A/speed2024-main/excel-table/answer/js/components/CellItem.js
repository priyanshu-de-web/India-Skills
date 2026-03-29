app.component("CellItem", {
    // language=HTML
    template: `
        <td :class="{title: isTitle}">
            <template v-if="isTitle">{{cellLocation}}</template>
            <input v-else type="text" v-model="$parent.cellData[cellLocation]" :key="getKey">
        </td>
    `,
    props: ["isTitle", "columnNumber", "row"],
    data() {
        return {

        }
    },
    methods: {
        getKey() {
            return this.row + " " + this.columnNumber;
        }
    },
    computed: {
        cellLocation() {
            return `${this.column}${this.row ? this.row : ""}`;
        },
        column() {
            if(!this.columnNumber) return "";
            return number2column(this.columnNumber);
        }
    },
    created() {

    }
})