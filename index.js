var invert = require("invert-stream")
    , uuid = require("node-uuid")
    , pipeline = require("event-stream").pipeline
    , through = require("through")

module.exports = DeltaStream

function DeltaStream(id) {
    var inverted = invert()
        , rejectSource = through(reject)
        , addSource = through(add)
        , stream = pipeline(rejectSource, inverted, addSource)

    stream.id = id || uuid()
    stream.other = inverted.other

    return stream

    function reject(data) {
        if (data[2] !== stream.id) {
            this.emit("data", data)
        }
    }

    function add(data) {
        if (!data[2]) {
            data[2] = stream.id
        }
        this.emit("data", data)
    }
}