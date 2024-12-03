export async function register(formData) {
    try {
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        const res = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to register');
        }

        return { success: data, error: null }; // Return success if registration succeeded
    } catch (error) {
        return { success: null, error: error.message }; // Return error if registration failed
    }
}


export async function login(formData) {
    try {
        const email = formData.get('email');
        const password = formData.get('password');

        // ส่งคำร้องไปยัง API
        const res = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        // หากคำร้องไม่สำเร็จ, โยนข้อผิดพลาด
        if (!res.ok) {
            throw new Error(data.error || 'Failed to log in');
        }

        // เก็บ Token ใน LocalStorage
        localStorage.setItem('token', data.token);

        // ส่งข้อมูลผู้ใช้และ Token กลับไป
        return { success: data, error: null };
    } catch (error) {
        // จัดการข้อผิดพลาด
        return { success: null, error: error.message };
    }
}





