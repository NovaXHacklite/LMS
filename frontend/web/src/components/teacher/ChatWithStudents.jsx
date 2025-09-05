import React from "react";

const ChatWithStudents = ({
  students = [],
  selectedStudent = null,
  setSelectedStudent = () => {},
  messages = [],
  chatInput = "",
  setChatInput = () => {},
  sendMessage = () => {}
}) => (
  <section className="p-4 border rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">Chat with Students</h2>
    <div className="flex space-x-4">
      {/* Student List */}
      <div className="w-1/3 border-r pr-2">
        <h3 className="font-semibold mb-2">Students</h3>
        {students.length === 0 ? (
          <p>No students available.</p>
        ) : (
          students.map((s) => (
            <button
              key={s.id || Math.random()}
              onClick={() => setSelectedStudent(s)}
              className={`block w-full text-left p-2 rounded ${
                selectedStudent?.id === s.id ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
            >
              {s.name || "Unnamed"}
            </button>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="w-2/3">
        {selectedStudent ? (
          <>
            <div className="h-40 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
              {messages
                .filter((msg) => msg.to === selectedStudent.name)
                .map((msg) => (
                  <div key={msg.id || Math.random()} className="mb-1">
                    <strong>You:</strong> {msg.text || ""}
                  </div>
                ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a student to start chatting.</p>
        )}
      </div>
    </div>
  </section>
);

export default ChatWithStudents;
