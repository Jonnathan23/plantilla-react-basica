import type { CounterRepository } from "@/features/demo/domain/repositories/counter.repository";
import type { CounterService } from "@/features/demo/domain/services/counter.services";
import { CounterLocalStorageMapper, type CounterMapper } from "@/features/demo/infrastructure/mappers/counter.mapper";
import { CounterLocalStorageRepository } from "@/features/demo/infrastructure/repositories/counter-local-storage.repository";
import { CounterCrudService } from "@/features/demo/infrastructure/services/counter-crud.services";

const repository: CounterRepository = new CounterLocalStorageRepository();
const mapper: CounterMapper = new CounterLocalStorageMapper();
const service: CounterService = new CounterCrudService(repository, mapper);

export const GetCountersService = service.getCounters.bind(service);
export const CreateCounterService = service.createCounter.bind(service);
export const UpdateCounterService = service.updateCounter.bind(service);
export const DeleteCounterService = service.deleteCounter.bind(service);
