import React from "react";

const UploadMaterials = ({
  materials = [],
  newMaterial = { subject: "", grade: "", difficulty: "", notes: "" },
  setNewMaterial,
  handleUpload,
}) => (
  <section className="p-4 border rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">Upload Learning Materials</h2>
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Subject"
        className="border p-2 rounded w-full"
        value={newMaterial?.subject || ""}
        onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
      />
      <input
        type="text"
        placeholder="Grade"
        className="border p-2 rounded w-full"
        value={newMaterial?.grade || ""}
        onChange={(e) => setNewMaterial({ ...newMaterial, grade: e.target.value })}
      />
      <input
        type="text"
        placeholder="level"
        className="border p-2 rounded w-full"
        value={newMaterial?.level || ""}
        onChange={(e) => setNewMaterial({ ...newMaterial, difficulty: e.target.value })}
      />
      <textarea
        placeholder="Notes"
        className="border p-2 rounded w-full"
        value={newMaterial?.notes || ""}
        onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </div>

    <ul className="mt-4 list-disc pl-6">
      {materials.map((m) => (
        <li key={m.id || Math.random()}>
          {m.subject} - {m.grade} ({m.difficulty})
        </li>
      ))}
    </ul>
  </section>
);

export default UploadMaterials;
