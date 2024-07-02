export const dosaveFeedBacks = async (data: Record<string, any>): Promise<any> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_CHAT_API}/user-feedbacks`);
  const headers = new Headers({
      "Content-type": "application/json; charset=UTF-8"
  });

  try {
      const response = await fetch(url.toString(), {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
      });
      return await response.json();
  } catch (error) {}
};
