const API_URL = 'http://localhost:5205/api/v1';

const users = [
    {
        "id": 1,
        "userName": "user1",
        "password": "password123",
        "fullName": "Diego Soto",
        "email": "djfnsjdnfjsdfs@gmail.com",
        "phone": "65786767777777",
        "role": "technician",
        "organization": "Laboratorios Andes S.A.",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
    {
        "id": 2,
        "userName": "user2",
        "password": "password123",
        "fullName": "María López",
        "email": "maria.lopez@example.com",
        "phone": "999000002",
        "role": "researcher",
        "organization": "BioInnovate Perú SAC",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
    {
        "id": 3,
        "userName": "user3",
        "password": "password123",
        "fullName": "José Ramírez",
        "email": "jose.ramirez@example.com",
        "phone": "999000003",
        "role": "technician",
        "organization": "Servicios de Laboratorio del Sur EIRL",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
    {
        "id": 4,
        "userName": "user4",
        "password": "password123",
        "fullName": "Lucía Herrera",
        "email": "lucia.herrera@example.com",
        "phone": "999000004",
        "role": "procurement_supervisor",
        "organization": "Insumos Científicos SAC",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
    {
        "id": 5,
        "userName": "user5",
        "password": "password123",
        "fullName": "Andrés Paredes",
        "email": "andres.paredes@example.com",
        "phone": "999000005",
        "role": "inspector",
        "organization": "Control y Aseguramiento Lab S.A.C.",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
    {
        "id": 6,
        "userName": "user6",
        "password": "password123",
        "fullName": "Marcelo Mazuelos",
        "email": "Marcelo572000@gmail.com",
        "phone": "+51963844498",
        "role": "technician",
        "organization": "Universidad Peruana de Ciencias Aplicadas",
        "documentRegistration": "DNI",
        "imgToImage": "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    }
];

async function seed() {
    console.log('Starting seeding process...');

    for (const user of users) {
        try {
            // 1. Sign Up
            console.log(`Creating user: ${user.userName}`);
            const signUpResponse = await fetch(`${API_URL}/authentication/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.userName,
                    password: user.password
                })
            });

            if (!signUpResponse.ok) {
                console.error(`Failed to sign up ${user.userName}: ${signUpResponse.statusText}`);
                continue;
            }

            // 2. Sign In to get Token
            console.log(`Signing in user: ${user.userName}`);
            const signInResponse = await fetch(`${API_URL}/authentication/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.userName,
                    password: user.password
                })
            });

            if (!signInResponse.ok) {
                console.error(`Failed to sign in ${user.userName}: ${signInResponse.statusText}`);
                continue;
            }

            const signInData = await signInResponse.json();
            const token = signInData.token;
            const userId = signInData.id;

            // 3. Create User Profile
            console.log(`Creating profile for: ${user.fullName}`);
            const names = user.fullName.split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ');

            const profileResponse = await fetch(`${API_URL}/userProfiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: user.email,
                    role: user.role,
                    organization: user.organization,
                    phone: user.phone,
                    documentRegistration: user.documentRegistration,
                    imgToImage: user.imgToImage
                })
            });

            if (!profileResponse.ok) {
                const errorText = await profileResponse.text();
                // If it's 400 or 500, log it. If it's because profile exists, handled gracefully usually.
                console.error(`Failed to create profile for ${user.userName}: ${profileResponse.status} - ${errorText}`);
            } else {
                console.log(`Profile created successfully for ${user.userName}`);
            }

        } catch (error) {
            console.error(`Error processing ${user.userName}:`, error);
        }
    }

    console.log('Seeding completed.');
}

seed();
