"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Tag = {
  name: string;
  description: string;
};

type ArticleData = {
  locale: string;
  date: string;
  title: string;
  text: string;
  citation_url: string;
  tags: Tag[];
};

export default function NewsPostForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [formData, setFormData] = useState<ArticleData[]>(
    ["ja", "en", "cn"].map((locale) => ({
      locale,
      date: "",
      title: "",
      text: "",
      citation_url: "",
      tags: [],
    }))
  );
  const [password, setPassword] = useState("");

  const handleJsonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const mapJsonData = () => {
    try {
      const data = JSON.parse(jsonInput);
      const citation_url = data.citation;
      const locales = ["japanese", "english", "chinese"];
      const mappedData = locales.map((key, index) => {
        const locale = ["ja", "en", "cn"][index];
        const article = data[key].article;
        const titleMatch = article.match(/^##\s(.+?)\n/);
        const title = titleMatch ? titleMatch[1] : "";
        const text = article.replace(/^##\s(.+?)\n/, "").trim();
        const tags = Object.entries(data[key].terms).map(
          ([name, description]) => ({
            name,
            description: String(description),
          })
        );

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        const date = nextDay.toISOString().split("T")[0];

        return { locale, date, title, text, citation_url, tags };
      });
      setFormData(mappedData);
    } catch (error) {
      console.error("Invalid JSON format", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // 1. パスワード認証を行い、JWT を取得
      const loginResponse = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
        console.error("Login failed:", loginResult.error);
        return;
      }

      const token = loginResult.token;
      localStorage.setItem("token", token); // JWT を保存
      console.log("Login successful");

      // 2. JWT を `Authorization` ヘッダーに含めてデータ送信
      for (const data of formData) {
        try {
          const postResponse = await fetch("/api/post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // JWT をヘッダーに追加
            },
            body: JSON.stringify(data),
          });

          const postResult = await postResponse.json();
          if (postResponse.ok) {
            console.log(`Success (${data.locale}):`, postResult);
          } else {
            console.error(
              `Error sending data (${data.locale}):`,
              postResult.error
            );
          }
        } catch (error) {
          console.error(`Error sending data (${data.locale}):`, error);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const ResetAll = () => {
    setFormData(
      ["ja", "en", "cn"].map((locale) => ({
        locale,
        date: "",
        title: "",
        text: "",
        citation_url: "",
        tags: [],
      }))
    );
    setJsonInput("");
  };

  const handleChangePasswordInput = (password: string) => {
    setPassword(password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[600px] mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex items-center pb-8 gap-8">
        <h1 className="text-2xl font-semibold text-gray-800 whitespace-nowrap">
          Create News Post
        </h1>
        <button
          type="button"
          onClick={ResetAll}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Reset All
        </button>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        JSON Input:
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </label>
      <button
        type="button"
        onClick={mapJsonData}
        className="w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Map JSON Data
      </button>

      <div>
        <label>
          password:
          <input
            type="text"
            value={password}
            onChange={(e) => handleChangePasswordInput(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </label>
      </div>

      {formData.map((data) => (
        <div
          key={data.locale}
          className="mt-6 p-4 border border-gray-300 rounded-md"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {data.locale.toUpperCase()} News
          </h3>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date:
            <input
              type="date"
              value={data.date}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title:
            <input
              type="text"
              value={data.title}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text:
            <textarea
              value={data.text}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citation URL:
            <input
              type="url"
              value={data.citation_url}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </label>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            Tags:
          </h3>
          {data.tags.map((tag, tagIndex) => (
            <div
              key={tagIndex}
              className="p-2 border border-gray-300 rounded-md mb-2"
            >
              <p className="text-sm font-medium text-gray-700">{tag.name}</p>
              <p className="text-sm text-gray-600">{tag.description}</p>
            </div>
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-2 px-4 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Submit
      </button>
    </form>
  );
}
