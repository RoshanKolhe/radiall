import { repository } from "@loopback/repository";
import { ToolsRepository } from "../repositories";
import { get, post } from "@loopback/rest";

export class AnalyticsController {
  constructor(
    @repository(ToolsRepository)
    private toolsRepository: ToolsRepository
  ) {}

  @get('/analytics/cards-data')
  async getCardsData(){
    try{
      const activeTools = await this.toolsRepository.count({isActive : true});
      const installationPendingTools = await this.toolsRepository.count({installationStatus : 'pending'});
      const internalValidationPendingTools = await this.toolsRepository.count({internalValidationStatus : 'pending'});
      const scrappedTools = await this.toolsRepository.count({status : 'scrapped'});

      return{
        activeToolsCount : activeTools.count,
        installationPendingToolsCount : installationPendingTools.count,
        internalValidationPendingToolsCount : internalValidationPendingTools.count,
        scrappedToolsCount : scrappedTools.count
      }
    }catch(error){
      throw error;
    }
  }
}
