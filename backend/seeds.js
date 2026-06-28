import { faker } from '@faker-js/faker';
import {prisma} from "./lib/prisma.js"


async function main() {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    const createdUsers =[];
    for (let i = 0; i < 5; i++) {
            const user = await prisma.user.create({
            data:{
                email:faker.internet.email(),
                username:faker.internet.username(),
                fullName:faker.person.fullName(),
                picture:faker.image.avatar()
            }
        })
        createdUsers.push(user);
    }
    for(const user of createdUsers){
        const otherUsers = createdUsers.filter((person)=> person.id != user.id)
        for (let i = 0; i < 2; i++) {
            const post =await prisma.post.create({
                data:{
                    userId: user.id,
                    text: faker.lorem.paragraphs({min:2,max:6}),

                }
            })
            const commentAuthors= faker.helpers.arrayElements(otherUsers,2);
            for(const author of commentAuthors){
                await prisma.comment.create({
                    data:{
                        postId:post.id,
                        userId: author.id,
                        text: faker.lorem.sentence(),
                    }
            })
            }
            const likeAuthors = faker.helpers.arrayElements(otherUsers,2);
            for(const author of likeAuthors){
                await prisma.like.create({
                    data:{
                        userId:author.id,
                        postId: post.id
                    }
                })
            }
    

            
        }

    }
}
main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("seeding done")
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });