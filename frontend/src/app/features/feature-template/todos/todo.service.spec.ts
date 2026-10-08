import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

const todo = (id: string, title = `Todo ${id}`): Todo => ({ id, title, description: null, isCompleted: false });

describe('TodoService', () => {
  let service: TodoService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TodoService],
    });
    service = TestBed.inject(TodoService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  async function loadWith(items: Todo[]): Promise<void> {
    const loading = service.load();
    controller.expectOne('todos').flush(items);
    await loading;
  }

  it('loads the list into state and toggles loading', async () => {
    const loading = service.load();
    expect(service.loading()).toBe(true);
    controller.expectOne('todos').flush([todo('1'), todo('2')]);
    await loading;

    expect(service.todos().map((t) => t.id)).toEqual(['1', '2']);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('keeps a failed load in the error signal instead of throwing', async () => {
    const loading = service.load();
    controller.expectOne('todos').flush(null, { status: 500, statusText: 'x' });
    await loading;

    expect(service.error()).not.toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('creates with a null id and adds the result to state', async () => {
    const saving = service.save({ id: null, title: 'New', description: null, isCompleted: false });
    const req = controller.expectOne('todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.id).toBeNull();
    req.flush(todo('9', 'New'));
    await saving;

    expect(service.todos().map((t) => t.id)).toEqual(['9']);
  });

  it('updates through the same endpoint and replaces the item in state', async () => {
    await loadWith([todo('1', 'Old'), todo('2')]);

    const saving = service.save({ id: '1', title: 'Changed', description: null, isCompleted: true });
    controller.expectOne('todos').flush({ ...todo('1', 'Changed'), isCompleted: true });
    await saving;

    expect(service.todos()).toHaveLength(2);
    expect(service.todos()[0].title).toBe('Changed');
  });

  it('removes the todo from state after a successful delete', async () => {
    await loadWith([todo('1'), todo('2')]);

    const removing = service.remove('1');
    const req = controller.expectOne('todos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
    await removing;

    expect(service.todos().map((t) => t.id)).toEqual(['2']);
  });

  it('keeps the todo in state when delete fails', async () => {
    await loadWith([todo('1')]);

    const removing = service.remove('1');
    controller.expectOne('todos/1').flush(null, { status: 500, statusText: 'x' });

    await expect(removing).rejects.toBeDefined();
    expect(service.todos()).toHaveLength(1);
  });

  it('gets one todo by id', async () => {
    const getting = service.get('5');
    controller.expectOne('todos/5').flush(todo('5'));

    expect((await getting).id).toBe('5');
  });
});
