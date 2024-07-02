export async function dosaveFeedBacks(data: Record<string, any>): Promise<any> {
    const url = new URL(`${process.env.NEXT_PUBLIC_CHAT_API}/user-feedbacks`);
    const headers = new Headers();
    headers.append("Content-type", "application/json; charset=UTF-8");
    try{
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
          });

    }catch(error){}

  }



