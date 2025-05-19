import { Filter, repository } from "@loopback/repository";
import { NotificationRepository, UserRepository } from "../repositories";
import { get, HttpErrors, param, patch, post } from "@loopback/rest";
import { Notification } from "../models";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { inject } from "@loopback/core";
import { UserProfile } from "@loopback/security";

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.VALIDATOR, PermissionKeys.INITIATOR, PermissionKeys.VIEWER]}
  })
  @get('/notifications')
  async getNotificationsByUser(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<{success: boolean; message: string; notifications: Notification[], unreadCount: number, allCount: number}>{
    try{
      const user = await this.userRepository.findById(currentUser?.id);
      
      if(!user){
        throw new HttpErrors.BadRequest('Unauthorized Access');
      }

      console.log('filter', filter);

      const notifications = await this.notificationRepository.find({where : {userId : user.id}, order: ['createdAt DESC'], ...filter});
      const unreadCount = await this.notificationRepository.find({
        where : {
          and : [
            {userId : user.id},
            {status : 0}
          ]
        }
      });

      const allCount = await this.notificationRepository.find({
        where : {
          and : [
            {userId : user.id},
          ]
        }
      });

      return{
        success : true,
        message : 'Notifications Data',
        notifications : notifications,
        unreadCount: unreadCount?.length,
        allCount: allCount?.length
      }
    }catch(error){
      throw error;
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.VALIDATOR, PermissionKeys.INITIATOR, PermissionKeys.VIEWER]}
  })
  @patch('/notifications/mark-as-read')
  async markAsRead(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser : UserProfile,
  ) : Promise<{success : boolean; message : string}>{
    try{
      const result = await this.notificationRepository.updateAll(
        { status: 1 },
        { userId: currentUser.id, status: 0 } 
      );

      return{
        success : true,
        message : 'All messages marked as read'
      }
    }catch(error){
      throw error;
    }
  }
}
